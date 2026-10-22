# `notFound()` from a dynamic segment returns an empty HTML body

A minimal reproduction for Next.js 16.3.8. It's a fresh `create-next-app@16.3.8` scaffold (first commit) plus two files (second commit):

- `app/[slug]/page.tsx`: `generateStaticParams` returns `[{ slug: 'known' }]`, and the page calls `notFound()` for any other slug.
- `app/not-found.tsx`: renders `<h1>Custom not-found copy</h1>`.

## Steps

```sh
npm install
npm run build
npm run start
```

Then, in another terminal:

```sh
curl -s http://localhost:3000/nope
curl -s http://localhost:3000/this/does/not/exist
```

## Expected

Both URLs return a 404 whose server-rendered HTML contains the root layout and `app/not-found.tsx`, so `<h1>Custom not-found copy</h1>` appears in `<body>`. That's what visitors without JavaScript (and some crawlers) see.

## Actual

- `/this/does/not/exist` matches no route. It returns 404 with `<html lang="en" …>` and the not-found copy in `<body>`, as expected.
- `/nope` matches `app/[slug]` and calls `notFound()` during render. It returns 404 with `<html id="__next_error__">` and an empty body: `<body><div hidden=""><!--$--><!--/$--></div>…scripts</body>`. The not-found copy is only in the inline RSC payload, so it appears only after hydration. With JavaScript disabled, the page is blank.

The same happens with `cacheComponents: true` in `next.config.ts`, and with the root layout under a dynamic `[lang]` segment (the setup where we first saw it). The copy is missing from the HTML in every case.

## Environment

- next 16.3.8, react 19.2.8, react-dom 19.2.8 (exact versions are in `package-lock.json`)
- `next build` and `next start` (production)
- Node 20.20.2 on macOS (Darwin 25.6.0)
