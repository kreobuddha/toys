# Dutch address lookup at checkout

Research for the checkout address form: what the browser can take from the Dutch address register
without our backend or a paid service.

## Answer

[PDOK Locatieserver](https://www.pdok.nl/pdok-locatieserver) is a free government geocoding
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

- Send a postcode without a space. `postcode:1012 JS` matched 533 addresses with `JS` in postcodes
  all over the country; lower case (`1012js`) did find Dam 1.
- `rows` on `/free` is capped at 100; `rows=101` returns 400.
- Some house numbers exist only with a letter: `1012JS` + `5` has no plain Dam 5, only `5B` to `5Y`.
- A house number can exist both plain and with additions (`1017CE` has `595` and `595A`).

## Alternatives

- **postcode.nl API, Google Places.** Both need an API key, so calls have to go through our
  backend to keep it secret. Such a proxy would also stop sending the visitor's IP address to
  the provider.
- **Format check only.** No external call, but a wrong house number reaches the order unnoticed.

## Privacy and trust

- Whatever the form looks up goes to PDOK (run by Kadaster, a Dutch government agency), together
  with the visitor's IP address. Nothing else from the form is sent.
- The lookup only helps the visitor: the order never waits for it, and the backend must validate
  the address itself.

## Status

The checkout suggests cities through `/suggest` with `fq=type:woonplaats`, then streets within the
chosen city: street names first, one row per house number once a number is typed. The automatic
postcode follows later in release 0.2.0.
