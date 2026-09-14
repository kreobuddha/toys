# Dutch address suggestions at checkout

Research behind the checkout address form: what the browser can take from the Dutch address
register without our backend or a paid service, and how the form uses it.

## Answer

[PDOK Locatieserver](https://www.pdok.nl/pdok-locatieserver) is a free government search service
over the BAG (Basisregistratie Adressen en Gebouwen, the national register of addresses and
buildings). It needs no API key and answers with `Access-Control-Allow-Origin: *`, typically within
0.1 s, so the browser calls it directly. No request limits or attribution rules are published and
availability is best effort; a cold connection has taken up to 5 s.

## Requests

Base URL `https://api.pdok.nl/bzk/locatieserver/search/v3_1`; `fq` repeats, one filter each.

Cities, from two typed characters:

```
/suggest?q=amst&fq=type:woonplaats&rows=10
  &fl=woonplaatsnaam,woonplaatscode,gemeentenaam,provincienaam
```

```json
{
  "woonplaatsnaam": "Amsterdam",
  "woonplaatscode": "3594",
  "gemeentenaam": "Amsterdam",
  "provincienaam": "Noord-Holland"
}
```

Street names within the chosen city, before a house number is typed (from three characters):

```
/suggest?q=heren&fq=type:weg&fq=woonplaatscode:3594&fl=straatnaam&rows=10
```

House numbers, once the line has one:

```
/suggest?q=herengracht 611&fq=type:adres&fq=woonplaatscode:3594
  &fl=straatnaam,huisnummer,postcode&rows=50
```

Every BAG address is a separate document, so Herengracht 611 comes back six times (`611-1A`,
`611-1V`, `611-2`, `611-3A`, `611-3V`, `611-H`, all `1017CE`). The form folds them into one row per
street and house number; letters and additions are typed into the apartment field.

## Findings (13–14 September 2026)

- Filter addresses by `woonplaatscode`, never by name. `woonplaatsnaam:Amsterdam` also matches
  Nieuw-Amsterdam, `Hengelo` matches Hengelo (Gld), and a quoted `"Ouderkerk aan de Amstel"` finds
  nothing.
- 70 of 2503 locality names repeat; municipality and province tell them apart.
- The city search also matches municipality and province words (`amst` finds Weesp, `zuid` puts
  Zevenhuizen first), so the browser moves names that start with the input to the top.
- Without a house number `type:adres` returns a street's addresses in no useful order (`heren`:
  2083 hits led by `384A-1`); that is why street names come first.
- There is no fuzzy matching, but a search without hits carries `spellcheck.collations` with a
  corrected `collationQuery` (`herengraht 611` → `herengracht 611`), and the form retries once.
- `highlighting` is always present and is raw HTML over the whole display name; it is not used.
- `/suggest` accepts up to `rows=3000`, `/free` up to 100.
- In a sample of 46 buildings with 3714 addresses no house number had two postcodes, but 402,653
  addresses have no postcode at all. The form fills the postcode only when the matching rows carry
  exactly one.
- Street names match as words, so `herengracht 61` also returns Nieuwe Herengracht 61 (`1011RP`,
  not `1015BC`). The postcode rule compares normalised street names exactly.
- A postcode must not contain a space when used as a filter: `postcode:1012 JS` matched 533
  addresses all over the country.

## Implementation

- `src/api/pdokApi.ts`: `suggestNlCities` and `suggestNlStreets`, injected into the shop API but on a
  base query of their own, so future auth headers never reach PDOK.
- `src/api/nlAddress.ts`: postcode format, address line parsing, street name normalisation.
- `src/components/Combobox/`: the suggestion input.
- `src/sections/Order/Checkout/components/AddressFields/`: the city (Amsterdam by default, the
  confirmed choice kept in `localStorage` with its code), street and house number, apartment, and
  the postcode filled from the rows unless the customer typed one.

## Alternatives

- **postcode.nl API, Google Places.** Both need an API key, so calls would go through our backend to
  keep it secret. Such a proxy would also stop sending the visitor's IP address to the provider.
- **No suggestions.** The form works without PDOK anyway; suggestions only save typing.

## Privacy and trust

- The typed city and street text goes to PDOK (run by Kadaster, a Dutch government agency) with the
  visitor's IP address. Nothing else from the form is sent.
- Suggestions only help: the order never waits for PDOK, only formats are checked, and the backend
  must validate the address itself.
