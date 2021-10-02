class MoveColumnFromInquiryToProgres < ActiveRecord::Migration[6.1]
  def change
    remove_column :inquiries, :staff_id
    add_column :progresses, :staff_id, :integer, after: :inquiry_id
  end
end
