package com.example.library.controller;

import com.example.library.pojo.entity.Aircon;
import com.example.library.service.AirconService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/aircon")
@Tag(name = "空调信息接口", description = "空调信息接口")
// @PreAuthorize("hasRole('ADMIN')")
public class AirconController {
    @Resource
    private AirconService airconService;


    @PostMapping("/add")
    @Operation(summary = "新增空调", description = "新增空调（设备+空调表）")
    public Boolean addAircon(@RequestBody Aircon aircon) {
        return airconService.addAircon(aircon);
    }

    @GetMapping("/getall")
    @Operation(summary = "查看所有空调", description = "查看所有空调")
    public List<Aircon> getAllAircons() {
        return airconService.getAllAircons();
    }

    @PostMapping("/turnonlight")
    @Operation(summary = "打开空调灯光", description = "打开空调灯光")
    public Boolean turnonlight(@RequestParam String deviceName) {
        return airconService.turnonlight(deviceName);
    }

    @PostMapping("/turnofflight")
    @Operation(summary = "关闭空调灯光", description = "关闭空调灯光")
    public Boolean turnofflight(@RequestParam String deviceName) {
        return airconService.turnofflight(deviceName);
    }

    @PostMapping("/changePower")
    @Operation(summary = "改变空调开关", description = "根据deviceId和status修改空调开关状态，status为0或1")
    public Boolean changePower(@RequestParam String deviceId, @RequestParam int status) {
        return airconService.updateAirconPower(deviceId, status);}
    @PostMapping("/updateMode")
    @Operation(summary = "修改空调模式", description = "根据deviceId和mode修改空调模式，同时更新设备描述")
    public Boolean updateAirconMode(@RequestParam String deviceId, @RequestParam String mode) {
        return airconService.updateAirconMode(deviceId, mode);
    }

    @PostMapping("/inc")
    @Operation(summary = "升高温度", description = "根据deviceName升高温度0.5度")
    public Boolean increaseTemperature(@RequestParam String deviceName) {
        return airconService.increaseTemperature(deviceName);
    }

    @PostMapping("/dec")
    @Operation(summary = "降低温度", description = "根据deviceName降低温度0.5度")
    public Boolean decreaseTemperature(@RequestParam String deviceName) {
        return airconService.decreaseTemperature(deviceName);
    }
    @PostMapping("/refri")
    @Operation(summary = "制冷模式", description = "将deviceName对应空改为制冷模式")
    public Boolean refrigerationmod(@RequestParam String deviceName) {
        return airconService.refrigerationmod(deviceName);
    }
    @PostMapping("/heat")
    @Operation(summary = "制热模式", description = "将deviceName对应空改为制热模式")
    public Boolean heatingmod(@RequestParam String deviceName) {
        return airconService.heatingmod(deviceName);
    }
//    @PostMapping("/dehumidifier")
    @Operation(summary = "抽湿模式", description = "将deviceName对应空改为抽湿模式")
    public Boolean dehumidifiermod(@RequestParam String deviceName) {
        return airconService.dehumidifiermod(deviceName);
    }
    @PostMapping("/blow")
    @Operation(summary = "送风模式", description = "将deviceName对应空改为送风模式")
    public Boolean blowmod(@RequestParam String deviceName) {
        return airconService.blowmod(deviceName);
    }
    @PostMapping("/desenergy")
    @Operation(summary = "打开空调节能模式", description = "打开空调节能模式")
    public Boolean desenergy(@RequestParam String deviceName) {
        return airconService.desenergy(deviceName);
    }
    @PostMapping("/turnoffdesenergy")
    @Operation(summary = "关闭空调节能模式", description = "关闭空调节能模式")
    public Boolean turnoffdesenergy(@RequestParam String deviceName) {
        return airconService.turnoffdesenergy(deviceName);
    }
    @PostMapping("/setWindLevel")
    @Operation(summary = "设置风量等级", description = "设置风量等级 (1-5)")
    public Boolean setWindLevel(
            @RequestParam String deviceName,
            @RequestParam int level
    ) {
        if (level < 1 || level > 5) {
            throw new IllegalArgumentException("风量等级必须在1-5范围内");
        }
        return airconService.setWindLevel(deviceName, level);
    }

}