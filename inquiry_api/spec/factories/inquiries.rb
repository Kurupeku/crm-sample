# == Schema Information
#
# Table name: inquiries
#
#  id                :bigint           not null, primary key
#  company_name      :string
#  detail            :text
#  email             :string           not null
#  introductory_term :string           not null
#  name              :string           not null
#  number_of_users   :integer          not null
#  tel               :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  staff_id          :integer
#  user_id           :integer
#
FactoryBot.define do
  factory :inquiry do
    staff_id { 1 }
    user_id { 1 }
    company_name { Faker::Company.name }
    name { Gimei.kanji }
    email { Faker::Internet.email }
    tel { Faker::PhoneNumber.phone_number }
    number_of_users { 1 }
    introductory_term { Faker::Lorem.word }
    detail { Faker::Lorem.paragraphs.join("\n") }
  end
end
