package com.ziyi;

import com.ziyi.utils.calcMarkers;

import java.util.ArrayList;

public class Main {


    private static void testCode1(){
        Marker p1 = new Marker(0, 121.822087, 39.086476, Camp.WHITE, 0); //宿舍
        Marker p2 = new Marker(10, 121.821105, 39.085464, Camp.GREEN, 1); //篮球场
        Marker p3 = new Marker(3, 121.818535, 39.086701, Camp.WHITE, 0); //教学楼
        ArrayList<Marker> markersList = new ArrayList<>(3);
        markersList.add(p1);
        markersList.add(p2);
        markersList.add(p3);
        for (int i = 0; i < 3; i ++){
            markersList.get(i).print();
        }
        System.out.println("--------------创建匿名BLUE对象Beat，宿舍附近----------------");
        calcMarkers.beatMarkers(new Beat(121.821984,39.086485, Camp.BLUE), markersList); //创建匿名对象Beat，宿舍附近
        for (int i = 0; i < 3; i ++){
            markersList.get(i).print();
        }
        System.out.println("--------------创建匿名BLUE对象Beat，篮球场附近----------------");
        calcMarkers.beatMarkers(new Beat(121.821039,39.08549, Camp.BLUE), markersList); //创建匿名对象Beat，篮球场附近
        for (int i = 0; i < 3; i ++){
            markersList.get(i).print();
        }
        System.out.println("--------------创建匿名BLUE对象Beat，教学楼附近----------------");
        calcMarkers.beatMarkers(new Beat(121.81847,39.086714, Camp.BLUE), markersList); //创建匿名对象Beat，教学楼附近
        for (int i = 0; i < 3; i ++){
            markersList.get(i).print();
        }
    }

    private static void testCode2(){
        Marker p1 = new Marker(0, 121.822087, 39.086476, Camp.WHITE, 0); //宿舍
        Marker p2 = new Marker(10, 121.821105, 39.085464, Camp.WHITE, 0); //篮球场 篮球场标记点距离宿舍140m
        Marker p3 = new Marker(3, 121.818535, 39.086701, Camp.WHITE, 0); //教学楼
        ArrayList<Marker> markersList = new ArrayList<>(3);
        markersList.add(p1);
        markersList.add(p2);
        markersList.add(p3);
        for (int i = 0; i < 3; i ++){
            markersList.get(i).print();
        }
        for (int j = 0;  j < 10; j ++){
            System.out.println("-------------------------------------------------------------------------------------------------");
            System.out.println(j + "--------------创建匿名BLUE对象Beat，宿舍附近----------------");
            calcMarkers.beatMarkers(new Beat(121.821984,39.086485, Camp.BLUE), markersList); //创建匿名对象Beat，宿舍附近
            markersList.get(0).print();
            markersList.get(1).print();
            markersList.get(2).print();
//            System.out.println("distance: "+ calcMarkers.distance(markersList.get(0), markersList.get(1)));
//            System.out.println("radius1: " + calcMarkers.radius(markersList.get(0)) + ", radius2: " + calcMarkers.radius(markersList.get(1)));
            System.out.println(j + "--------------创建匿名GREEN对象Beat，篮球场附近----------------");
            calcMarkers.beatMarkers(new Beat(121.821039,39.08549, Camp.GREEN), markersList); //创建匿名对象Beat，篮球场附近
            markersList.get(0).print();
            markersList.get(1).print();
            markersList.get(2).print();
//            System.out.println("distance: "+ calcMarkers.distance(markersList.get(0), markersList.get(1)));
//            System.out.println("radius1: " + calcMarkers.radius(markersList.get(0)) + ", radius2: " + calcMarkers.radius(markersList.get(1)));
            System.out.println("--------------创建匿名BLUE对象Beat * 3，教学楼附近----------------");
            calcMarkers.beatMarkers(new Beat(121.81847,39.086714, Camp.BLUE), markersList); //创建匿名对象Beat，教学楼附近
            calcMarkers.beatMarkers(new Beat(121.81847,39.086714, Camp.BLUE), markersList); //创建匿名对象Beat，教学楼附近
            calcMarkers.beatMarkers(new Beat(121.81847,39.086714, Camp.BLUE), markersList); //创建匿名对象Beat，教学楼附近
            markersList.get(0).print();
            markersList.get(1).print();
            markersList.get(2).print();

        }

    }
    public static void main(String[] args) {
//        testCode1();//攻击导致圈变色以及大小变化
        testCode2();//圆相切状态下的攻击
    }
}
