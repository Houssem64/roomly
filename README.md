<p align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/6295/6295417.png" width="100" />
</p>
<p align="center">
    <h1 align="center">ROOMLY</h1>
</p>
<p align="center">
    <em><code>► INSERT-TEXT-HERE</code></em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/Houssem64/roomly?style=flat&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/Houssem64/roomly?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/Houssem64/roomly?style=flat&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/Houssem64/roomly?style=flat&color=0080ff" alt="repo-language-count">
<p>
<p align="center">
		<em>Developed with the software and tools below.</em>
</p>
<p align="center">
	<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
	<img src="https://img.shields.io/badge/PostCSS-DD3A0A.svg?style=flat&logo=PostCSS&logoColor=white" alt="PostCSS">
	<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
	<img src="https://img.shields.io/badge/Axios-5A29E4.svg?style=flat&logo=Axios&logoColor=white" alt="Axios">
	<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white" alt="TypeScript">
	<img src="https://img.shields.io/badge/Prisma-2D3748.svg?style=flat&logo=Prisma&logoColor=white" alt="Prisma">
	<img src="https://img.shields.io/badge/Leaflet-199900.svg?style=flat&logo=Leaflet&logoColor=white" alt="Leaflet">
	<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" alt="JSON">
</p>
<hr>

##  Quick Links

> - [ Overview](#-overview)
> - [ Features](#-features)
> - [ Repository Structure](#-repository-structure)
> - [ Modules](#-modules)
> - [ Getting Started](#-getting-started)
>   - [ Installation](#-installation)
>   - [ Running roomly](#-running-roomly)
>   - [ Tests](#-tests)
> - [ Project Roadmap](#-project-roadmap)
> - [ Contributing](#-contributing)
> - [ License](#-license)
> - [ Acknowledgments](#-acknowledgments)

---

##  Overview

<code>► INSERT-TEXT-HERE</code>

---

##  Features

<code>► INSERT-TEXT-HERE</code>

---

##  Repository Structure

```sh
└── roomly/
    ├── README.md
    ├── components.json
    ├── next.config.mjs
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.mjs
    ├── prisma
    │   └── schema.prisma
    ├── public
    │   ├── images
    │   │   ├── logo.png
    │   │   └── placeholder.jpg
    │   ├── next.svg
    │   └── vercel.svg
    ├── src
    │   ├── app
    │   │   ├── actions
    │   │   │   ├── getAllListings.ts
    │   │   │   ├── getCurrentUser.ts
    │   │   │   ├── getFavoriteListings.ts
    │   │   │   ├── getListingById.ts
    │   │   │   ├── getListings.ts
    │   │   │   ├── getReservations.ts
    │   │   │   └── getUsers.ts
    │   │   ├── admin
    │   │   │   ├── dashboard
    │   │   │   │   └── page.tsx
    │   │   │   └── page.tsx
    │   │   ├── api
    │   │   │   ├── alllistings
    │   │   │   │   └── route.ts
    │   │   │   ├── favorites
    │   │   │   │   └── [listingId]
    │   │   │   ├── listings
    │   │   │   │   ├── [listingId]
    │   │   │   │   └── route.ts
    │   │   │   ├── register
    │   │   │   │   └── route.ts
    │   │   │   ├── reservations
    │   │   │   │   ├── [reservationId]
    │   │   │   │   └── route.ts
    │   │   │   └── users
    │   │   │       ├── [userId]
    │   │   │       └── route.ts
    │   │   ├── components
    │   │   │   ├── Avatar.tsx
    │   │   │   ├── Button.tsx
    │   │   │   ├── CategoryBox.tsx
    │   │   │   ├── Container.tsx
    │   │   │   ├── EmptyState.tsx
    │   │   │   ├── Heading.tsx
    │   │   │   ├── Inputs
    │   │   │   │   ├── Calendar.tsx
    │   │   │   │   ├── CategoryInput.tsx
    │   │   │   │   ├── Counter.tsx
    │   │   │   │   ├── CountrySelect.tsx
    │   │   │   │   ├── ImageUpload.tsx
    │   │   │   │   └── Input.tsx
    │   │   │   ├── Loader.tsx
    │   │   │   ├── Map.tsx
    │   │   │   ├── Modals
    │   │   │   │   ├── LoginModal.tsx
    │   │   │   │   ├── Modal.tsx
    │   │   │   │   ├── RegisterModal.tsx
    │   │   │   │   ├── RentModal.tsx
    │   │   │   │   └── SearchModal.tsx
    │   │   │   ├── Navbar
    │   │   │   │   ├── Categories.tsx
    │   │   │   │   ├── Logo.tsx
    │   │   │   │   ├── MenuItem.tsx
    │   │   │   │   ├── NavBar.tsx
    │   │   │   │   ├── Search.tsx
    │   │   │   │   └── UserMenu.tsx
    │   │   │   ├── TNDSvg.tsx
    │   │   │   └── listings
    │   │   │       ├── HeartButton.tsx
    │   │   │       ├── ListingCard.tsx
    │   │   │       ├── ListingCategory.tsx
    │   │   │       ├── ListingHead.tsx
    │   │   │       ├── ListingInfo.tsx
    │   │   │       └── ListingReservation.tsx
    │   │   ├── error.tsx
    │   │   ├── favicon.ico
    │   │   ├── favorites
    │   │   │   ├── FavoritesClient.tsx
    │   │   │   └── page.tsx
    │   │   ├── globals.css
    │   │   ├── hooks
    │   │   │   ├── useFavorite.ts
    │   │   │   ├── useLoginModal.ts
    │   │   │   ├── useRegisterModal.ts
    │   │   │   ├── useRentModal.ts
    │   │   │   └── useSearchModal.ts
    │   │   ├── layout.tsx
    │   │   ├── libs
    │   │   │   └── prismadb.ts
    │   │   ├── listings
    │   │   │   └── [listingId]
    │   │   │       ├── ListingClient.tsx
    │   │   │       └── page.tsx
    │   │   ├── loading.tsx
    │   │   ├── my-properties
    │   │   │   ├── MyProperties.tsx
    │   │   │   └── page.tsx
    │   │   ├── my-reservations
    │   │   │   ├── MyReservations.tsx
    │   │   │   └── page.tsx
    │   │   ├── page.tsx
    │   │   ├── property-reservations
    │   │   │   ├── ReservationsClient.tsx
    │   │   │   └── page.tsx
    │   │   ├── providers
    │   │   │   └── ToasterProvider.tsx
    │   │   └── types
    │   │       └── index.ts
    │   ├── components
    │   │   └── ui
    │   │       ├── avatar.tsx
    │   │       ├── badge.tsx
    │   │       ├── button.tsx
    │   │       ├── card.tsx
    │   │       ├── dropdown-menu.tsx
    │   │       ├── input.tsx
    │   │       └── table.tsx
    │   ├── lib
    │   │   └── utils.ts
    │   └── pages
    │       └── api
    │           └── auth
    │               └── [...nextauth].ts
    ├── tailwind.config.ts
    └── tsconfig.json
```

---

##  Modules

<details closed><summary>.</summary>

| File                                                                                     | Summary                         |
| ---                                                                                      | ---                             |
| [postcss.config.mjs](https://github.com/Houssem64/roomly/blob/master/postcss.config.mjs) | <code>► INSERT-TEXT-HERE</code> |
| [tailwind.config.ts](https://github.com/Houssem64/roomly/blob/master/tailwind.config.ts) | <code>► INSERT-TEXT-HERE</code> |
| [components.json](https://github.com/Houssem64/roomly/blob/master/components.json)       | <code>► INSERT-TEXT-HERE</code> |
| [tsconfig.json](https://github.com/Houssem64/roomly/blob/master/tsconfig.json)           | <code>► INSERT-TEXT-HERE</code> |
| [package.json](https://github.com/Houssem64/roomly/blob/master/package.json)             | <code>► INSERT-TEXT-HERE</code> |
| [next.config.mjs](https://github.com/Houssem64/roomly/blob/master/next.config.mjs)       | <code>► INSERT-TEXT-HERE</code> |
| [package-lock.json](https://github.com/Houssem64/roomly/blob/master/package-lock.json)   | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.pages.api.auth</summary>

| File                                                                                                    | Summary                         |
| ---                                                                                                     | ---                             |
| [[...nextauth].ts](https://github.com/Houssem64/roomly/blob/master/src/pages/api/auth/[...nextauth].ts) | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.components.ui</summary>

| File                                                                                                     | Summary                         |
| ---                                                                                                      | ---                             |
| [avatar.tsx](https://github.com/Houssem64/roomly/blob/master/src/components/ui/avatar.tsx)               | <code>► INSERT-TEXT-HERE</code> |
| [dropdown-menu.tsx](https://github.com/Houssem64/roomly/blob/master/src/components/ui/dropdown-menu.tsx) | <code>► INSERT-TEXT-HERE</code> |
| [badge.tsx](https://github.com/Houssem64/roomly/blob/master/src/components/ui/badge.tsx)                 | <code>► INSERT-TEXT-HERE</code> |
| [card.tsx](https://github.com/Houssem64/roomly/blob/master/src/components/ui/card.tsx)                   | <code>► INSERT-TEXT-HERE</code> |
| [input.tsx](https://github.com/Houssem64/roomly/blob/master/src/components/ui/input.tsx)                 | <code>► INSERT-TEXT-HERE</code> |
| [table.tsx](https://github.com/Houssem64/roomly/blob/master/src/components/ui/table.tsx)                 | <code>► INSERT-TEXT-HERE</code> |
| [button.tsx](https://github.com/Houssem64/roomly/blob/master/src/components/ui/button.tsx)               | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.lib</summary>

| File                                                                         | Summary                         |
| ---                                                                          | ---                             |
| [utils.ts](https://github.com/Houssem64/roomly/blob/master/src/lib/utils.ts) | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app</summary>

| File                                                                               | Summary                         |
| ---                                                                                | ---                             |
| [error.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/error.tsx)     | <code>► INSERT-TEXT-HERE</code> |
| [loading.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/loading.tsx) | <code>► INSERT-TEXT-HERE</code> |
| [globals.css](https://github.com/Houssem64/roomly/blob/master/src/app/globals.css) | <code>► INSERT-TEXT-HERE</code> |
| [page.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/page.tsx)       | <code>► INSERT-TEXT-HERE</code> |
| [layout.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/layout.tsx)   | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.admin</summary>

| File                                                                               | Summary                         |
| ---                                                                                | ---                             |
| [page.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/admin/page.tsx) | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.admin.dashboard</summary>

| File                                                                                         | Summary                         |
| ---                                                                                          | ---                             |
| [page.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/admin/dashboard/page.tsx) | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.types</summary>

| File                                                                               | Summary                         |
| ---                                                                                | ---                             |
| [index.ts](https://github.com/Houssem64/roomly/blob/master/src/app/types/index.ts) | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.listings.[listingId]</summary>

| File                                                                                                                | Summary                         |
| ---                                                                                                                 | ---                             |
| [ListingClient.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/listings/[listingId]/ListingClient.tsx) | <code>► INSERT-TEXT-HERE</code> |
| [page.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/listings/[listingId]/page.tsx)                   | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.actions</summary>

| File                                                                                                             | Summary                         |
| ---                                                                                                              | ---                             |
| [getListings.ts](https://github.com/Houssem64/roomly/blob/master/src/app/actions/getListings.ts)                 | <code>► INSERT-TEXT-HERE</code> |
| [getAllListings.ts](https://github.com/Houssem64/roomly/blob/master/src/app/actions/getAllListings.ts)           | <code>► INSERT-TEXT-HERE</code> |
| [getListingById.ts](https://github.com/Houssem64/roomly/blob/master/src/app/actions/getListingById.ts)           | <code>► INSERT-TEXT-HERE</code> |
| [getUsers.ts](https://github.com/Houssem64/roomly/blob/master/src/app/actions/getUsers.ts)                       | <code>► INSERT-TEXT-HERE</code> |
| [getCurrentUser.ts](https://github.com/Houssem64/roomly/blob/master/src/app/actions/getCurrentUser.ts)           | <code>► INSERT-TEXT-HERE</code> |
| [getReservations.ts](https://github.com/Houssem64/roomly/blob/master/src/app/actions/getReservations.ts)         | <code>► INSERT-TEXT-HERE</code> |
| [getFavoriteListings.ts](https://github.com/Houssem64/roomly/blob/master/src/app/actions/getFavoriteListings.ts) | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.components</summary>

| File                                                                                                  | Summary                         |
| ---                                                                                                   | ---                             |
| [Loader.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/Loader.tsx)           | <code>► INSERT-TEXT-HERE</code> |
| [Map.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/Map.tsx)                 | <code>► INSERT-TEXT-HERE</code> |
| [Heading.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/Heading.tsx)         | <code>► INSERT-TEXT-HERE</code> |
| [Avatar.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/Avatar.tsx)           | <code>► INSERT-TEXT-HERE</code> |
| [TNDSvg.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/TNDSvg.tsx)           | <code>► INSERT-TEXT-HERE</code> |
| [EmptyState.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/EmptyState.tsx)   | <code>► INSERT-TEXT-HERE</code> |
| [Container.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/Container.tsx)     | <code>► INSERT-TEXT-HERE</code> |
| [Button.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/Button.tsx)           | <code>► INSERT-TEXT-HERE</code> |
| [CategoryBox.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/CategoryBox.tsx) | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.components.Inputs</summary>

| File                                                                                                             | Summary                         |
| ---                                                                                                              | ---                             |
| [Input.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/Inputs/Input.tsx)                 | <code>► INSERT-TEXT-HERE</code> |
| [CountrySelect.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/Inputs/CountrySelect.tsx) | <code>► INSERT-TEXT-HERE</code> |
| [Counter.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/Inputs/Counter.tsx)             | <code>► INSERT-TEXT-HERE</code> |
| [CategoryInput.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/Inputs/CategoryInput.tsx) | <code>► INSERT-TEXT-HERE</code> |
| [ImageUpload.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/Inputs/ImageUpload.tsx)     | <code>► INSERT-TEXT-HERE</code> |
| [Calendar.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/Inputs/Calendar.tsx)           | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.components.Navbar</summary>

| File                                                                                                       | Summary                         |
| ---                                                                                                        | ---                             |
| [Search.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/Navbar/Search.tsx)         | <code>► INSERT-TEXT-HERE</code> |
| [NavBar.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/Navbar/NavBar.tsx)         | <code>► INSERT-TEXT-HERE</code> |
| [UserMenu.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/Navbar/UserMenu.tsx)     | <code>► INSERT-TEXT-HERE</code> |
| [Logo.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/Navbar/Logo.tsx)             | <code>► INSERT-TEXT-HERE</code> |
| [MenuItem.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/Navbar/MenuItem.tsx)     | <code>► INSERT-TEXT-HERE</code> |
| [Categories.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/Navbar/Categories.tsx) | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.components.Modals</summary>

| File                                                                                                             | Summary                         |
| ---                                                                                                              | ---                             |
| [SearchModal.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/Modals/SearchModal.tsx)     | <code>► INSERT-TEXT-HERE</code> |
| [Modal.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/Modals/Modal.tsx)                 | <code>► INSERT-TEXT-HERE</code> |
| [LoginModal.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/Modals/LoginModal.tsx)       | <code>► INSERT-TEXT-HERE</code> |
| [RentModal.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/Modals/RentModal.tsx)         | <code>► INSERT-TEXT-HERE</code> |
| [RegisterModal.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/Modals/RegisterModal.tsx) | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.components.listings</summary>

| File                                                                                                                         | Summary                         |
| ---                                                                                                                          | ---                             |
| [HeartButton.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/listings/HeartButton.tsx)               | <code>► INSERT-TEXT-HERE</code> |
| [ListingInfo.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/listings/ListingInfo.tsx)               | <code>► INSERT-TEXT-HERE</code> |
| [ListingCard.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/listings/ListingCard.tsx)               | <code>► INSERT-TEXT-HERE</code> |
| [ListingHead.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/listings/ListingHead.tsx)               | <code>► INSERT-TEXT-HERE</code> |
| [ListingReservation.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/listings/ListingReservation.tsx) | <code>► INSERT-TEXT-HERE</code> |
| [ListingCategory.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/components/listings/ListingCategory.tsx)       | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.libs</summary>

| File                                                                                    | Summary                         |
| ---                                                                                     | ---                             |
| [prismadb.ts](https://github.com/Houssem64/roomly/blob/master/src/app/libs/prismadb.ts) | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.api.register</summary>

| File                                                                                      | Summary                         |
| ---                                                                                       | ---                             |
| [route.ts](https://github.com/Houssem64/roomly/blob/master/src/app/api/register/route.ts) | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.api.reservations</summary>

| File                                                                                          | Summary                         |
| ---                                                                                           | ---                             |
| [route.ts](https://github.com/Houssem64/roomly/blob/master/src/app/api/reservations/route.ts) | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.api.reservations.[reservationId]</summary>

| File                                                                                                          | Summary                         |
| ---                                                                                                           | ---                             |
| [route.ts](https://github.com/Houssem64/roomly/blob/master/src/app/api/reservations/[reservationId]/route.ts) | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.api.users</summary>

| File                                                                                   | Summary                         |
| ---                                                                                    | ---                             |
| [route.ts](https://github.com/Houssem64/roomly/blob/master/src/app/api/users/route.ts) | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.api.users.[userId]</summary>

| File                                                                                            | Summary                         |
| ---                                                                                             | ---                             |
| [route.ts](https://github.com/Houssem64/roomly/blob/master/src/app/api/users/[userId]/route.ts) | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.api.listings</summary>

| File                                                                                      | Summary                         |
| ---                                                                                       | ---                             |
| [route.ts](https://github.com/Houssem64/roomly/blob/master/src/app/api/listings/route.ts) | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.api.listings.[listingId]</summary>

| File                                                                                                  | Summary                         |
| ---                                                                                                   | ---                             |
| [route.ts](https://github.com/Houssem64/roomly/blob/master/src/app/api/listings/[listingId]/route.ts) | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.api.alllistings</summary>

| File                                                                                         | Summary                         |
| ---                                                                                          | ---                             |
| [route.ts](https://github.com/Houssem64/roomly/blob/master/src/app/api/alllistings/route.ts) | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.api.favorites.[listingId]</summary>

| File                                                                                                   | Summary                         |
| ---                                                                                                    | ---                             |
| [route.ts](https://github.com/Houssem64/roomly/blob/master/src/app/api/favorites/[listingId]/route.ts) | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.property-reservations</summary>

| File                                                                                                                           | Summary                         |
| ---                                                                                                                            | ---                             |
| [ReservationsClient.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/property-reservations/ReservationsClient.tsx) | <code>► INSERT-TEXT-HERE</code> |
| [page.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/property-reservations/page.tsx)                             | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.providers</summary>

| File                                                                                                         | Summary                         |
| ---                                                                                                          | ---                             |
| [ToasterProvider.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/providers/ToasterProvider.tsx) | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.my-properties</summary>

| File                                                                                                       | Summary                         |
| ---                                                                                                        | ---                             |
| [MyProperties.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/my-properties/MyProperties.tsx) | <code>► INSERT-TEXT-HERE</code> |
| [page.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/my-properties/page.tsx)                 | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.hooks</summary>

| File                                                                                                     | Summary                         |
| ---                                                                                                      | ---                             |
| [useRentModal.ts](https://github.com/Houssem64/roomly/blob/master/src/app/hooks/useRentModal.ts)         | <code>► INSERT-TEXT-HERE</code> |
| [useLoginModal.ts](https://github.com/Houssem64/roomly/blob/master/src/app/hooks/useLoginModal.ts)       | <code>► INSERT-TEXT-HERE</code> |
| [useSearchModal.ts](https://github.com/Houssem64/roomly/blob/master/src/app/hooks/useSearchModal.ts)     | <code>► INSERT-TEXT-HERE</code> |
| [useRegisterModal.ts](https://github.com/Houssem64/roomly/blob/master/src/app/hooks/useRegisterModal.ts) | <code>► INSERT-TEXT-HERE</code> |
| [useFavorite.ts](https://github.com/Houssem64/roomly/blob/master/src/app/hooks/useFavorite.ts)           | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.favorites</summary>

| File                                                                                                         | Summary                         |
| ---                                                                                                          | ---                             |
| [page.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/favorites/page.tsx)                       | <code>► INSERT-TEXT-HERE</code> |
| [FavoritesClient.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/favorites/FavoritesClient.tsx) | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>src.app.my-reservations</summary>

| File                                                                                                             | Summary                         |
| ---                                                                                                              | ---                             |
| [MyReservations.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/my-reservations/MyReservations.tsx) | <code>► INSERT-TEXT-HERE</code> |
| [page.tsx](https://github.com/Houssem64/roomly/blob/master/src/app/my-reservations/page.tsx)                     | <code>► INSERT-TEXT-HERE</code> |

</details>

<details closed><summary>prisma</summary>

| File                                                                                  | Summary                         |
| ---                                                                                   | ---                             |
| [schema.prisma](https://github.com/Houssem64/roomly/blob/master/prisma/schema.prisma) | <code>► INSERT-TEXT-HERE</code> |

</details>

---

##  Getting Started

***Requirements***

Ensure you have the following dependencies installed on your system:

* **TypeScript**: `version x.y.z`

###  Installation

1. Clone the roomly repository:

```sh
git clone https://github.com/Houssem64/roomly
```

2. Change to the project directory:

```sh
cd roomly
```

3. Install the dependencies:

```sh
npm install
```

###  Running roomly

Use the following command to run roomly:

```sh
npm run build && node dist/main.js
```

###  Tests

To execute tests, run:

```sh
npm test
```

---

##  Project Roadmap

- [X] `► INSERT-TASK-1`
- [ ] `► INSERT-TASK-2`
- [ ] `► ...`

---

##  Contributing

Contributions are welcome! Here are several ways you can contribute:

- **[Submit Pull Requests](https://github.com/Houssem64/roomly/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.
- **[Join the Discussions](https://github.com/Houssem64/roomly/discussions)**: Share your insights, provide feedback, or ask questions.
- **[Report Issues](https://github.com/Houssem64/roomly/issues)**: Submit bugs found or log feature requests for Roomly.

<details closed>
    <summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your GitHub account.
2. **Clone Locally**: Clone the forked repository to your local machine using a Git client.
   ```sh
   git clone https://github.com/Houssem64/roomly
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to GitHub**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.

Once your PR is reviewed and approved, it will be merged into the main branch.

</details>

---

##  License

This project is protected under the [SELECT-A-LICENSE](https://choosealicense.com/licenses) License. For more details, refer to the [LICENSE](https://choosealicense.com/licenses/) file.

---

##  Acknowledgments

- List any resources, contributors, inspiration, etc. here.

[**Return**](#-quick-links)

---
