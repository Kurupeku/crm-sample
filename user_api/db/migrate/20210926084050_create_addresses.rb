class CreateAddresses < ActiveRecord::Migration[6.1]
  def change
    create_table :addresses do |t|
      t.references :user, foreign_key: true
      t.string :postal_code
      t.string :prefecture
      t.string :city
      t.string :street
      t.string :building

      t.timestamps
    end
  end
end
