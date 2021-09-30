# frozen_string_literal: true

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
class Menu < ApplicationRecord
  has_many :menu_inquiry_attachments
  has_many :inquiries, through: :menu_inquiry_attachments

  validates :name, presence: true, uniqueness: true

  scope :published, lambda {
    where.not published_on: nil
  }

  scope :unpublished, lambda {
    where published_on: nil
  }
end
