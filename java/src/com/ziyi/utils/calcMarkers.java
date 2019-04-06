package com.ziyi.utils;

import com.ziyi.Beat;
import com.ziyi.Camp;
import com.ziyi.Marker;

import java.security.SignatureException;
import java.util.ArrayList;

/**
 * @Author: ziuno
 * @Date: 2019/4/6 18:31
 */
public class calcMarkers {
    private static double EARTH_RADIUS = 6378.137;
    private static double INIT_RADIUS = 10.0;
    private static double STEP_SIZE = 10.0;

    private static double rad(double d) {
        return d * Math.PI / 180.0;
    }

    public static double distance(Marker marker1, Marker marker2) {
        double lng1 = marker1.getLongitude();
        double lng2 = marker2.getLongitude();
        double lat1 = marker1.getLatitude();
        double lat2 = marker2.getLatitude();
        return distance(lng1, lat1, lng2, lat2);
    }

    private static double distance(double lng1, double lat1, double lng2, double lat2) {
        double radLat1 = rad(lat1);
        double radLat2 = rad(lat2);
        double a = radLat1 - radLat2;
        double b = rad(lng1) - rad(lng2);
        double s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
                + Math.cos(radLat1) * Math.cos(radLat2)
                * Math.pow(Math.sin(b / 2), 2)));
        s = s * EARTH_RADIUS;
        s = Math.round(s * 10000d) / 10000d;
        s = s * 1000;
        return s;
    }

    public static double radius(Marker marker) {
        return marker.getCount() * STEP_SIZE + INIT_RADIUS;
    }

    private static void updateTangency(ArrayList<Marker> markersList, boolean[][] tangency) {
        double distance;
        int size = markersList.size();
        for (int i = 0; i < size; i++) {
            tangency[i][i] = false;
            for (int j = 0; j < i; j++) {
                distance = distance(markersList.get(i), markersList.get(j));
                tangency[i][j] = tangency[j][i] = distance <= (radius(markersList.get(i)) + radius(markersList.get(j)));
            }
        }
    }

    public static void beatMarkers(Beat beat, ArrayList<Marker> markersList) {
        int size = markersList.size();
        boolean[][] tangency = new boolean[size][size];
        double longitude = beat.getLongitude();
        double latitude = beat.getLatitude();
        boolean[] inCircle = new boolean[size];
        long count;
        Marker tmpMarker;
        Camp tmpCamp;
        for (int i = 0; i < size; i++) {
            tmpMarker = markersList.get(i);
            inCircle[i] = distance(longitude, latitude, tmpMarker.getLongitude(), tmpMarker.getLatitude()) < radius(tmpMarker);
        }
        updateTangency(markersList, tangency);
        for (int i = 0; i < size; i++) {
            if (inCircle[i]) {
                tmpMarker = markersList.get(i);
                if (markersList.get(i).getCamp() == Camp.WHITE) {
                    count = tmpMarker.getCount() + 1;
                    tmpMarker.setCount(count);
                    tmpMarker.setCamp(beat.getCamp());
                    return;
                } else if (beat.getCamp() == markersList.get(i).getCamp()) {
                    count = tmpMarker.getCount() + 1;
                    tmpMarker.setCount(count);
                    tmpCamp = tmpMarker.getCamp();
                    for (int j = 0; j < size; j++) {
                        if (i == j)
                            continue;
                        if (tangency[i][j]) {
                            tmpMarker = markersList.get(j);
                            count = tmpMarker.getCount() - 1;
                            tmpMarker.setCount(count);
                            if (tmpMarker.getCount() == 0) {
                                tmpMarker.setCamp(Camp.WHITE);
                            } else if (tmpMarker.getCount() == -1){
                                tmpMarker.setCount(0);
                                tmpMarker.setCamp(tmpCamp);
                            }
                        }
                    }
                } else{
                    tmpMarker.setCount(tmpMarker.getCount() - 1);
                    if (tmpMarker.getCount() == 0) {
                        tmpMarker.setCamp(Camp.WHITE);
                    }
                }
                updateTangency(markersList, tangency);
            }
        }
    }
}
