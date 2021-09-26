# frozen_string_literal: true

EMAIL_REGEXP = /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i.freeze
PHONE_NUMBER_REGEX =
  /\A0(\d{1}[-(]?\d{4}|\d{2}[-(]?\d{3}|\d{3}[-(]?\d{2}|\d{4}[-(]?\d{1})[-)]?\d{4}\z|\A0[5789]0-?\d{4}-?\d{4}\z/.freeze
