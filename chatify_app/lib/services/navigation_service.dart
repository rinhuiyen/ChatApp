import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class NavigationService {
  GlobalKey<NavigatorState> navigatorKey;

  static NavigationService instance = NavigationService();

  NavigationService() {
    navigatorKey = GlobalKey<NavigatorState>();
  }

  Future<dynamic> navigateToReplacement(String _routeName) {
    //navigate to that route and replace the new page with existing page
    return navigatorKey.currentState.pushReplacementNamed(_routeName);
  }

  Future<dynamic> navigateTo(String _routeName) {
    //push a route on top of another page
    return navigatorKey.currentState.pushNamed(_routeName);
  }

  Future<dynamic> navigateToRoute(MaterialPageRoute _route) {
    //navigate the page to whatever route it is passed into
    return navigatorKey.currentState.push(_route);
  }

  goBack() {
    navigatorKey.currentState.pop();
  }
}
