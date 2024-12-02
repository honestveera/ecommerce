include Pagy::Backend

module PaginationHelper
    def paginate_records(records, page_param: :page, per_page_param: :per_page)
      page = params[page_param] || 1
      per_page = params[per_page_param] || Pagy::DEFAULT[:items] 
      pagy, paginated_records = pagy(records, items: per_page, page: page)
      {
        pagy: pagy,
        records: paginated_records
      }
    end

    def render_pagination(pagination_info, serializer, status_info)
        render json: {
            status: status_info,
            items: ActiveModelSerializers::SerializableResource.new(pagination_info[:records], each_serializer: serializer),
            pagy: pagination_info[:pagy]
          }
    end
  end