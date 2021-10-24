class HealthCheckController < ApplicationController
  def index
    render json: { status: 'success' }.to_json, status: :ok
  end
end
