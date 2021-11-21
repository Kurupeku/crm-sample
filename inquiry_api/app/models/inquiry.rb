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
  before_save :ref_user_id_to_comments

  has_one :progress, dependent: :delete
  has_many :comments, dependent: :delete_all
  has_many :menu_inquiry_attachments, dependent: :delete_all
  has_many :menus, through: :menu_inquiry_attachments

  with_options presence: true do
    validates :name
    validates :number_of_users, numericality: { only_integer: true, greater_than: 0 }
    validates :introductory_term
  end

  validates :email, format: { with: EMAIL_REGEXP }
  validates :tel, format: { with: PHONE_NUMBER_REGEX }
  validates_associated :progress

  scope :company_name_cont, lambda { |word|
    return all if word.blank?

    where 'company_name LIKE ?', "%#{word}%"
  }

  scope :name_cont, lambda { |word|
    return all if word.blank?

    where 'name LIKE ?', "%#{word}%"
  }

  scope :email_cont, lambda { |word|
    return all if word.blank?

    where 'email LIKE ?', "%#{word}%"
  }

  scope :fields_cont, lambda { |word|
    return all if word.blank?

    company_name_cont(word)
      .or(name_cont(word))
      .or(email_cont(word))
  }

  scope :state_eq, lambda { |state|
    return all if state.blank?

    joins(:progress).merge Progress.state_eq(state)
  }

  scope :staff_eq, lambda { |staff_id|
    return all if staff_id.blank?

    joins(:progress).merge Progress.staff_eq(staff_id)
  }

  private

  def init_progress
    build_progress if progress.blank?
  end

  def ref_user_id_to_comments
    return if user_id.blank? || !user_id_changed?

    comments.update_all user_id: user_id
  end
end
