class CreateInquiries < ActiveRecord::Migration[6.1]
  def change
    create_table :inquiries do |t|
      t.integer :staff_id
      t.integer :user_id
      t.string :company_name
      t.string :name, null: false
      t.string :email, null: false
      t.string :tel, null: false
      t.integer :number_of_users, null: false
      t.string :introductory_term, null: false
      t.text :detail

      t.timestamps
    end
  end
end
