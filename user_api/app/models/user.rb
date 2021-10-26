# frozen_string_literal: true

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
# Indexes
#
#  index_users_on_email  (email)
#
class User < ApplicationRecord
  has_one :address, dependent: :destroy

  validates :name, presence: true
  validates :email, uniqueness: true, format: { with: EMAIL_REGEXP }
  validates :tel, format: { with: PHONE_NUMBER_REGEX }

  def created_at_unix
    created_at&.to_i
  end

  def updated_at_unix
    updated_at&.to_i
  end
end
