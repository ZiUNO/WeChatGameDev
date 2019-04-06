package com.ziyi;

/**
 * @Author: ziuno
 * @Date: 2019/4/6 19:06
 */
public class Beat {
    private double longitude, latitude;

    public double getLongitude() {
        return longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public Camp getCamp() {
        return camp;
    }

    private Camp camp;

    public Beat(double longitude, double latitude, Camp camp){
        this.longitude = longitude;
        this.latitude = latitude;
        this.camp = camp;
    }
}
