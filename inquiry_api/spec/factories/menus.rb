# == Schema Information
#
# Table name: menus
#
#  id           :bigint           not null, primary key
#  name         :string           not null
#  published_on :date
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
FactoryBot.define do
  factory :menu do
    name { Faker::Lorem.unique.word }
    published_on { nil }
  end
end
