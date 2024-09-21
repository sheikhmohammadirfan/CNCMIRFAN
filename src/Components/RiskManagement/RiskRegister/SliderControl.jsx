import { Box, Divider, Icon, Slider, Tooltip, Typography } from '@material-ui/core'
import React from 'react'
import { Controller } from 'react-hook-form'

const SliderControl = ({ name, control, rules, marks, classes, isCreateForm, ...props }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules?.[name]}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        return (
          <>
            <Box
              display={!isCreateForm && "flex"}
              gridColumnGap={30}
              className={value === null ? classes.noValue : ""}>
              <Slider
                step={null}
                marks={marks}
                value={value || 0}
                onChange={(e, val) => onChange(val)}
                style={{ width: isCreateForm ? "100%" : "70%" }}
                className={classes.customSlider}
                {...props}
              />
              <Divider flexItem orientation='vertical' className={classes.sliderDivider} />
              <Box flex={1} className="description">
                {error
                  ?
                  <Typography style={{ color: "red" }}>{error.message}</Typography>
                  :
                  <Box className={classes.sliderCaption}>
                    <Box
                      className={classes.sliderValueTitle}
                      flexDirection={!isCreateForm && "column"}
                      textAlign={!isCreateForm && "center"}
                    >
                      <Typography className={classes.sliderTitleLabel}>
                        <Typography>{marks.find(x => x.value === value)?.label}</Typography>
                        {!isCreateForm &&
                          <Tooltip
                            title={marks.find(x => x.value === value)?.desc}
                            placement='left'
                            interactive
                            classes={{ tooltip: classes.sliderDescTooltip }}
                          >
                            <Icon>info</Icon>
                          </Tooltip>}
                      </Typography>
                      {isCreateForm && <Typography>{value !== undefined && "-"}</Typography>}
                      <Typography>
                        {marks.find(x => x.value === value)?.name}
                      </Typography>
                    </Box>
                    {isCreateForm && <Box className={classes.sliderValueDesc}>
                      {marks.find(x => x.value === value)?.desc}
                    </Box>}
                  </Box>
                }
              </Box>
            </Box>
          </>
        )
      }}
    />
  )
}

export default SliderControl