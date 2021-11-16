# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::ChangeProgressState, type: :request do
  let(:inquiry) { create :inquiry }
  let(:progress) { inquiry.progress }
  def input(id, event)
    <<~INPUT
      mutation {
        changeProgressState(input: {
          id: "#{id}",
          event: #{event}
        }) {
          id
          state
        }
      }
    INPUT
  end

  describe '正常な値を与えた場合' do
    it 'レコードが更新される' do
      result = AppSchema.execute input(progress.id, 'contact')
      is_asserted_by { result.dig('data', 'changeProgressState', 'state') == 'contacting' }
      is_asserted_by { progress.reload.state == 'contacting' }
    end
  end

  describe 'バリデーションに引っかかった場合' do
    it 'errorsフィールドにエラー内容が生成され、レコードは更新されない' do
      result = AppSchema.execute input(progress.id, 'order')
      is_asserted_by { result.key?('errors') }
      is_asserted_by { progress.reload.state == 'waiting' }
    end
  end

  describe '存在しないIDを指定した場合' do
    it 'errorsフィールドにエラー内容が生成され、レコードは更新されない' do
      result = AppSchema.execute input(0, 'contacting')
      is_asserted_by { result.key?('errors') }
      is_asserted_by { progress.reload.state == 'waiting' }
    end
  end
end
