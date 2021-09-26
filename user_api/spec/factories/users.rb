# == Schema Information
#
# Table name: users
#
#  id           :bigint           not null, primary key
#  company_name :string
#  email        :string           not null
#  name         :string           not null
#  tel          :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
FactoryBot.define do
  factory :user do
    company_name { Faker::Company.name }
    name { Gimei.kanji }
    email { Faker::Internet.email }
    tel { Faker::PhoneNumber.phone_number }
  end
end
