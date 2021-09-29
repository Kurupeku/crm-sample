class ChangeColumnNameAasmState < ActiveRecord::Migration[6.1]
  def change
    rename_column :progresses, :aasm_state, :state
  end
end
