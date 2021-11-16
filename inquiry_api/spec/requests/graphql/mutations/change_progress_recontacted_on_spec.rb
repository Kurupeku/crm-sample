# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::ChangeProgressRecontactedOn, type: :request do
  let(:inquiry) { create :inquiry }
  let(:progress) { inquiry.progress }
  def input(id, date)
    <<~INPUT
      mutation {
        changeProgressRecontactedOn(input: {
          id: "#{id}",
          recontactedOn: "#{date}"
        }) {
          id
          recontactedOn
        }
      }
    INPUT
  end

  describe '正常な値を与えた場合' do
    it 'レコードが更新される' do
      date = '2021-01-01'
      progress.recontact!
      result = AppSchema.execute input(progress.id, date)
      is_asserted_by { result.dig('data', 'changeProgressRecontactedOn', 'recontactedOn') == date }
      is_asserted_by { progress.reload.recontacted_on == Date.parse(date) }
    end
  end

  describe 'state: waiting_recontact以外の状態で値を与えた場合' do
    it 'errorsフィールドにエラー内容が生成され、レコードは更新されない' do
      date = '2021-01-01'
      result = AppSchema.execute input(progress.id, date)
      is_asserted_by { result.key?('errors') }
      is_asserted_by { progress.reload.recontacted_on.nil? }
    end
  end

  describe '存在しないIDを指定した場合' do
    it 'errorsフィールドにエラー内容が生成され、レコードは更新されない' do
      result = AppSchema.execute input(0, '2021-01-01')
      is_asserted_by { result.key?('errors') }
      is_asserted_by { progress.reload.recontacted_on.nil? }
    end
  end
end
