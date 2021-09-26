# == Schema Information
#
# Table name: addresses
#
#  id          :bigint           not null, primary key
#  building    :string
#  city        :string
#  postal_code :string
#  prefecture  :string
#  street      :string
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
class Address < ApplicationRecord
  belongs_to :user

  with_options presence: true do
    validates :city
    validates :street
  end

  validates :prefecture, inclusion: { in: PREFS_ARRAY }
  validates :postal_code, format: { with: POSTAL_CODE_REGEX }

  def full_address
    [prefecture, city, address, building].select(&:present?).join
  end

  def full_address_with_postal_code
    [postal_code, full_address].join ' '
  end
end
