# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::ChangeProgressRank, type: :request do
  let(:inquiry) { create :inquiry }
  let(:progress) { inquiry.progress }
  def input(id, rank)
    <<~INPUT
      mutation {
        changeProgressRank(input: {
          id: "#{id}",
          rank: #{rank}
        }) {
          id
          rank
        }
      }
    INPUT
  end

  describe '正常な値を与えた場合' do
    it 'レコードが更新される' do
      result = AppSchema.execute input(progress.id, 'a')
      is_asserted_by { result.dig('data', 'changeProgressRank', 'rank') == 'a' }
      is_asserted_by { progress.reload.rank == 'a' }
    end
  end

  describe '存在しないIDを指定した場合' do
    it 'errorsフィールドにエラー内容が生成され、レコードは更新されない' do
      result = AppSchema.execute input(0, 'a')
      is_asserted_by { result.key?('errors') }
      is_asserted_by { progress.reload.rank == 'd' }
    end
  end
end
