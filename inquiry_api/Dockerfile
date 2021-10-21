FROM ruby:3.0.2-alpine AS base

ENV WORKDIR="/usr/src/app"
ENV LANG=ja_JP.UTF-8
ENV TZ=Asia/Tokyo

ENV GEM_HOME /bundle
ENV BUNDLE_PATH $GEM_HOME
ENV BUNDLE_BIN $BUNDLE_PATH/bin
ENV PATH $BUNDLE_BIN:$PATH

ENV RUNTIME_PACKAGES bash gcc linux-headers musl-dev libxml2-dev make tzdata imagemagick nodejs yarn postgresql-dev
ENV DEV_PACKAGES build-base curl-dev


WORKDIR ${WORKDIR}

RUN apk update && apk upgrade && \
  apk add --no-cache ${RUNTIME_PACKAGES} && \
  apk add --virtual build-dependencies --no-cache ${DEV_PACKAGES}

# COPY package.json yarn.lock ${WORKDIR}
# RUN yarn install

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["/usr/bin/entrypoint.sh"]

# ---------------------------------------------------------

FROM base AS dev

COPY Gemfile* ${WORKDIR}

RUN bundle install -j4

COPY . ${WORKDIR}

EXPOSE 3003
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "3003"]

# ---------------------------------------------------------

FROM base AS prod

ENV NODE_ENV production
ENV RAILS_ENV production
ENV BUNDLE_WITHOUT development:test

COPY Gemfile* ${WORKDIR}

RUN bundle config set --local deployment 'true' && \
  bundle config set --local path "${BUNDLE_PATH}" && \
  bundle install -j4 && \
  rm -rf /usr/local/bundle/cache/* /usr/local/share/.cache/* /var/cache/* /tmp/* && \
  apk del build-dependencies

# Require SECRET_KEY_BASE
# RUN bundle exec rails assets:precompile \
#   && yarn cache clean \
#   && rm -rf node_modules tmp/cache

COPY . ${WORKDIR}

EXPOSE 3003
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "3003", "-e", "production"]
