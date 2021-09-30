# == Schema Information
#
# Table name: menu_inquiry_attachments
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  inquiry_id :bigint           not null
#  menu_id    :bigint           not null
#
# Indexes
#
#  index_menu_inquiry_attachments_on_inquiry_id  (inquiry_id)
#  index_menu_inquiry_attachments_on_menu_id     (menu_id)
#
# Foreign Keys
#
#  fk_rails_...  (inquiry_id => inquiries.id)
#  fk_rails_...  (menu_id => menus.id)
#
class MenuInquiryAttachment < ApplicationRecord
  belongs_to :menu
  belongs_to :inquiry
end
