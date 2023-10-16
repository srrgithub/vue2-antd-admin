import request from '@/utils/request'

const api = {
  tMmMaterialTypeClass: '/tMmMaterialTypeClass',
}

export default api

export function getTree() {
  return request({
    url: `${api.tMmMaterialTypeClass}/tree`,
    method: 'get',
  })
}
