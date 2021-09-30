class CreateMenuInquiryAttachments < ActiveRecord::Migration[6.1]
  def change
    create_table :menu_inquiry_attachments do |t|
      t.references :menu, null: false, foreign_key: true
      t.references :inquiry, null: false, foreign_key: true

      t.timestamps
    end
  end
end
