# Dutch address lookup at checkout

Research for release 0.1.0: can the checkout fill in the street and city of a Dutch address from
the postcode and house number, without our backend or a paid service?

## Answer

Yes. [PDOK Locatieserver](https://www.pdok.nl/pdok-locatieserver) is a free government geocoding
service built on the BAG (Basisregistratie Adressen en Gebouwen, the national register of
addresses and buildings). It needs no API key and responds with `Access-Control-Allow-Origin: *`,
so the browser can call it directly.

## Request and response

```
GET https://api.pdok.nl/bzk/locatieserver/search/v3_1/free
  ?q=*
  &fq=type:adres
  &fq=postcode:1012JS
  &fq=huisnummer:1
  &fl=weergavenaam,straatnaam,huisnummer,huisletter,huisnummertoevoeging,postcode,woonplaatsnaam
  &rows=100
```

```json
{
  "response": {
    "numFound": 1,
    "docs": [
      {
        "weergavenaam": "Dam 1, 1012JS Amsterdam",
        "straatnaam": "Dam",
        "huisnummer": 1,
        "postcode": "1012JS",
        "woonplaatsnaam": "Amsterdam"
      }
    ]
  }
}
```

Every address is a separate document. A house number with additions returns one document per
addition: `1017CE` + `611` gives `Herengracht 611-1A`, `611-1V`, `611-2`, `611-3A`, `611-3V` and
`611-H`, with the addition in `huisnummertoevoeging`. A letter comes in `huisletter` (`Dam 5B`),
and both can be present (`Allard Piersonstraat 1A-2`). An unknown address gives `numFound: 0`.

## Findings from testing (13 September 2026)

- Send the postcode without a space. `postcode:1012 JS` matched 533 addresses with `JS` in
  postcodes all over the country. Lower case (`1012js`) did find Dam 1, but the client
  normalises to `1012JS` anyway and keeps only documents whose postcode and house number match
  exactly.
- `rows` is capped at 100; `rows=101` returns 400. A building with more than 100 additions under
  one house number comes back truncated, so an addition missing from a truncated list is not
  rejected: postcode and house number already determine street and city.
- Some house numbers exist only with a letter: `1012JS` + `5` has no plain Dam 5, only `5B` to
  `5Y`. The form then asks for the addition and suggests the valid ones.
- A house number can exist both plain and with additions (`1017CE` has `595` and `595A`). An
  empty addition then means the plain address.

## Alternatives

- **postcode.nl API, Google Places.** Both need an API key, so calls have to go through our
  backend to keep it secret. Such a proxy would also stop sending the visitor's IP address to
  the provider.
- **Format check only.** No external call, but a wrong house number reaches the order unnoticed.

## Privacy and trust

- The postcode, the house number and the visitor's IP address go to PDOK (run by Kadaster,
  a Dutch government agency). Nothing else from the form is sent.
- The lookup helps the visitor; it does not protect the order. The backend must validate the
  address again. When PDOK is unavailable, the form falls back to manual street and city fields.

## Implementation

- `src/api/nlAddress.ts`: postcode and addition normalisation, validation, matching the typed
  addition against the lookup.
- `src/api/pdokApi.ts`: the `lookupNlAddress` endpoint, injected into the shop API but with a base
  query of its own.
- `src/sections/Order/Checkout/components/AddressFields/`: the fields, the lookup after a 400 ms
  pause and the confirmation line. `Checkout.tsx` checks the address once more on submit.
