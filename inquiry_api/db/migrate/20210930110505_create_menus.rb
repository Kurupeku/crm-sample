class CreateMenus < ActiveRecord::Migration[6.1]
  def change
    create_table :menus do |t|
      t.string :name, null: false, unique: true
      t.date :published_on

      t.timestamps
    end
  end
end
