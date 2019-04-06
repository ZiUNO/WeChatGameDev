package com.ziyi;

import jdk.nashorn.internal.runtime.regexp.joni.exception.ValueException;

/**
 * @Author: ziuno
 * @Date: 2019/4/6 17:13
 */


public class Marker {

    public double getLongitude() {
        return longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public Camp getCamp() {
        return camp;
    }

    public long getCount() {
        return count;
    }

    private double longitude, latitude;
    private Camp camp;

    public void setCamp(Camp camp) {
        this.camp = camp;
    }

    public void setCount(long count) {
        this.count = count;
    }

    private long count;
    private long id;

    public Marker(long id, double longitude, double latitude, Camp camp, long count) {
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.camp = camp;
        this.count = count;
        if ((camp == Camp.WHITE && count != 0) || (camp != Camp.WHITE && count == 0))
            throw new ValueException("白色阵营时人数必须为0");
    }

    public void print() {
        System.out.println("id: " + id + ", camp: " + camp + ", count: " + count);
    }
}
