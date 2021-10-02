class CreateComments < ActiveRecord::Migration[6.1]
  def change
    create_table :comments do |t|
      t.references :inquiry, null: false, foreign_key: true
      t.integer :user_id, null: false, index: true
      t.text :content, null: false

      t.timestamps
    end
  end
end
