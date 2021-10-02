# FROM node:14-buster as node

FROM ruby:3-buster

ENV TZ Asia/Tokyo
ENV LANG C.UTF-8

# COPY --from=node /usr/local/bin/ /usr/local/bin/
# COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules

WORKDIR /usr/src/app

RUN apt-get update -qq \
  && apt-get install -yq postgresql-client

# RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
#     && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
#     && apt install -yq yarn

COPY Gemfile ./
COPY Gemfile.lock ./
RUN bundle install

COPY . ./

# RUN yarn install

# # use only production image
# RUN rails assets:precompile RAILS_ENV=production

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

EXPOSE 3000

CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
