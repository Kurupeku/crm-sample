# frozen_string_literal: true

EMAIL_REGEXP = /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i.freeze
PHONE_NUMBER_REGEX =
  /\A0(\d{1}-\d{4}|\d{2}-\d{3}|\d{3}-\d{2}|\d{4}-\d{1})-\d{4}\z|\A0[5789]0-\d{4}-\d{4}\z/.freeze
POSTAL_CODE_REGEX = /\A\d{3}-\d{4}\z/.freeze

PREFS_ARRAY = %w[北海道 青森県 岩手県 宮城県 秋田県 山形県 福島県
                 茨城県 栃木県 群馬県 埼玉県 千葉県 東京都 神奈川県
                 新潟県 富山県 石川県 福井県 山梨県 長野県 岐阜県
                 静岡県 愛知県 三重県 滋賀県 京都府 大阪府 兵庫県
                 奈良県 和歌山県 鳥取県 島根県 岡山県 広島県 山口県
                 徳島県 香川県 愛媛県 高知県 福岡県 佐賀県 長崎県
                 熊本県 大分県 宮崎県 鹿児島県 沖縄県].freeze
