class CreateProgresses < ActiveRecord::Migration[6.1]
  def change
    create_table :progresses do |t|
      t.references :inquiry, null: false, foreign_key: true
      t.integer :rank, null: false, default: 0
      t.timestamp :contacted_at
      t.date :recontacted_on

      t.timestamps
    end
  end
end
