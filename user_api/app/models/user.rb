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

  scope :company_name_cont, lambda { |word|
    where 'company_name LIKE ?', "%#{word}%"
  }

  scope :name_cont, lambda { |word|
    where 'name LIKE ?', "%#{word}%"
  }

  scope :email_cont, lambda { |word|
    where 'email LIKE ?', "%#{word}%"
  }

  scope :fields_cont, lambda { |word|
    return all if word.blank?

    company_name_cont(word)
      .or(name_cont(word))
      .or(email_cont(word))
  }

  def created_at_unix
    created_at&.to_i
  end

  def updated_at_unix
    updated_at&.to_i
  end
end
