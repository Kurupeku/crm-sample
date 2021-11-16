# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::ChangeProgressStaff, type: :request do
  let(:inquiry) { create :inquiry }
  let(:progress) { inquiry.progress }
  let(:current_staff_id) { 1 }
  before do
    progress.update staff_id: current_staff_id
  end
  def input(id, staff_id)
    <<~INPUT
      mutation {
        changeProgressStaff(input: {
          id: "#{id}",
          staffId: #{staff_id}
        }) {
          id
          staffId
        }
      }
    INPUT
  end

  describe '正常な値を与えた場合' do
    it 'レコードが更新される' do
      new_staff_id = current_staff_id + 1
      result = AppSchema.execute input(progress.id, new_staff_id)
      is_asserted_by { result.dig('data', 'changeProgressStaff', 'staffId') == new_staff_id }
      is_asserted_by { progress.reload.staff_id == new_staff_id }
    end
  end

  describe 'バリデーションに引っかかった場合' do
    it 'errorsフィールドにエラー内容が生成され、レコードは更新されない' do
      result = AppSchema.execute input(progress.id, 0)
      is_asserted_by { result.key?('errors') }
      is_asserted_by { progress.reload.staff_id == current_staff_id }
    end
  end

  describe '存在しないIDを指定した場合' do
    it 'errorsフィールドにエラー内容が生成され、レコードは更新されない' do
      result = AppSchema.execute input(0, current_staff_id + 1)
      is_asserted_by { result.key?('errors') }
      is_asserted_by { progress.reload.staff_id == current_staff_id }
    end
  end
end
