import { queryTagGroup } from "@/api/autoTag/createAutoTag";
export default {
  data() {},
  methods: {
    // 获取标签组信息
    queryTagGroupInfo(type) {
      queryTagGroup({ id: this.groupId }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          let tagGroupInfo = {
            groupId: data.groupId,
            groupName: data.groupName,
            createBy: data.createBy,
            createTime: data.createTime,
            updateBy: data.updateBy,
            updateTime: data.updateTime,
            tagGroupCustomerCount: data.tagGroupCustomerCount,
          };
          let tagList = [];
          data.weAutoTagDetailsResponseDTOList.forEach(
            ({
              customerAction,
              materialId,
              name,
              tagId,
              weAutoTagRuleResponseDTOList,
              customerResponseDTOList,
              materialList,
            }) => {
              materialList = materialList || [];
              let { mediaType, materialName } = materialList[0] || {};
              let mediaTypeTxt = ["图片", "语音", "视频", "文件", "文本", "海报", "", "文章", "链接"];
              let tag = {
                customerAction,
                materialId,
                name,
                tagId,
                materialInfo: `${mediaTypeTxt[mediaType] || ""} "${materialName || ""}"`,
                materialList,
              };
              tag.tagRuleList = [];
              weAutoTagRuleResponseDTOList.forEach(
                ({ conditionExpression, conditionType, conditionUnit, conditionValue }) => {
                  let rule = {
                    conditionExpression,
                    conditionType,
                    conditionUnit,
                    conditionValue,
                  };
                  tag.tagRuleList.push(rule);
                }
              );
              tagList.push(tag);
            }
          );
          tagGroupInfo.tagList = tagList;
          this.tagGroupInfo = tagGroupInfo;
          if (tagGroupInfo.tagList.length) {
            this.curTagIndex = 0;
            this.isChangeTag = true;
          }
          if (type) {
            // 编辑标签组
            this.conTypeRecord = this.computeTagCon();
            // 解决编辑标签组conType重新计算
            this.resetConTypeForTag();
          }
        }
      });
    },
  },
};
