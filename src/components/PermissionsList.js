//======================================================
import { ref } from "vue";
import { getUserAPI } from "@/api/obd_alwayshow";
//抓取車牌資料

export function usePermissionsList() {
  const PermissionsID = { ID: "1" }; //最高管理權限
  const PermissionsCarlist = ref({});

  getUserAPI(PermissionsID)
    .then((res) => {
      //console.log(res);
      PermissionsCarlist.value = res.data.car_list;
      //console.log(PermissionsCarlist.value);
    })
    .catch((err) => {
      //console.log(err);
    });
  return { PermissionsCarlist };
}
