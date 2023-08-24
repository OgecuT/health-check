# Healthcheck Monitor

## Features

- Telegram integration

## Future Considerations

- Additional messaging platform support

## Installation

```ya
version: '2.4'

services:
  healthcheck:
    container_name: healthcheck
    image: ogecut/health-check:latest
    environment:
      # [Required] - The name of the container to monitor and the label app marker
      CONTAINER_NAME: 'healthcheck'
      # [Required] - Label to preface messages.
      SERVER_LABEL: 'Dev'
      # [Optional] - Filtering monitored containers
      # If missing or set to false (default), any containers with a "healthcheck.enable: 'false'" label will be excluded, and all others monitored.
      # If set to true, only containers with a "healthcheck.enable: 'true'" label will be included.
      LABEL_ENABLE: 'false'
      # [Optional] - Only show when container state changes to being offline (paused, exited, running (unhealthy), or dead)
      ONLY_OFFLINE_STATES: 'true'
      # [Optional] - Regardless of any other settings, you can ignore or include 'exited'
      EXCLUDE_EXITED: 'false'
      # [Optional] - Set the poll period in seconds. Defaults to 10 seconds, which is also the minimum.
      PERIOD: 10
      # [Optional] - Suppress startup messages from being sent. Default is false
      DISABLE_STARTUP_MSG: 'false'
      # See documentation for how to obtain ID values
      TELEGRAM_BOT_TOKEN: ''
      # Multiple chat IDs can be specified, separated by commas
      TELEGRAM_CHAT_IDS: ''
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    restart: unless-stopped
```

- For Telegram: See documentation for how to obtain ID values
- For Pushbullet: Open Pushbullet in a browser and get device ID from
  URL [Example](https://raw.githubusercontent.com/petersem/monocker/master/doco/pbdeviceid.PNG)
- For Pushover: See pushover doco for user key and app token
- For Discord: See Discord doco for how to create a webhook and get the url

## License

**The MIT License (MIT)**