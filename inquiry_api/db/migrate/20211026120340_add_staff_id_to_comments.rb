class AddStaffIdToComments < ActiveRecord::Migration[6.1]
  def change
    add_column :comments, :staff_id, :integer, null: false
    add_index :comments, :staff_id
  end
end
