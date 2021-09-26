# == Schema Information
#
# Table name: addresses
#
#  id          :bigint           not null, primary key
#  building    :string
#  city        :string           not null
#  postal_code :string           not null
#  prefecture  :string           not null
#  street      :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :bigint
#
# Indexes
#
#  index_addresses_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :address do
    association :user, factory: :user

    postal_code { Faker::Address.zip_code }
    prefecture { Gimei.address.prefecture.kanji }
    city { Gimei.address.city.kanji }
    street { Gimei.address.town.kanji }
    building { nil }
  end
end
