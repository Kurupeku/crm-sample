# frozen_string_literal: true

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
class Inquiry < ApplicationRecord
  with_options presence: true do
    validates :name
    validates :email, fomat: { with: EMAIL_REGEXP }
    validates :tel, format: { with: PHONE_NUMBER_REGEX }
    validates :number_of_users
    validates :introductory_term
  end
end
