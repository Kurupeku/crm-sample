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
#  user_id           :integer
#
class Inquiry < ApplicationRecord
  before_save :init_progress

  has_one :progress
  has_many :comments

  with_options presence: true do
    validates :name
    validates :number_of_users, numericality: { only_integer: true, greater_than: 0 }
    validates :introductory_term
  end

  validates :email, format: { with: EMAIL_REGEXP }
  validates :tel, format: { with: PHONE_NUMBER_REGEX }

  private

  def init_progress
    build_progress if progress.blank?
  end
end
