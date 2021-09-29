class AddAasmStateToProgresses < ActiveRecord::Migration[6.1]
  def change
    add_column :progresses, :aasm_state, :string
  end
end
