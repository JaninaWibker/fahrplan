# Fahrplan

A quick and easy way to turn an iCAL calendar into an interactive web page for your events.

<img src="./.github/assets/screenshot.png" width="300" /> <img src="./.github/assets/demo.gif" width="300" />

## Getting Started

Create an `.env` file which sets the following environment variables:

```bash
ICAL_URL="<url of ical file>"      # use http://localhost:<port>/<filename>.ics for a local file (public/; only works with the dev server)
NEXT_PUBLIC_BASE_PATH="<base path, e.g. /fahrplan or />"

# optional
DATE_RANGE_CLAMP_CURRENT_YEAR=true # option 1: only show events in the current year

DATE_RANGE_CLAMP_START=2023-01-02  # option 2: specify a starting and
DATE_RANGE_CLAMP_END=2023-03-04    # option 2: ending date
```

Install dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Deployment

To deploy *fahrplan* you can use Docker.
There is an example docker image, but this has a `.env` file built-in.
You have to build your own image with your own `.env` file, to do so in GitHub actions see the [publish workflow](./.github/workflows/publish.yml).

Otherwise you can build the container locally:

```bash
# create .env file
cat <<EOF > .env
ICAL_URL="<...>"
# ...
EOF

# build the image
docker build -t fahrplan .

# start the container
docker run -p 3000:3000 fahrplan
```

Alternatively you can deploy *fahrplan* on [Vercel](https://vercel.com/) and set the environment variables in the Vercel dashboard.
