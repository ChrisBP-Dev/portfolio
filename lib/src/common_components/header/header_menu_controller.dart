import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'header_menu_controller.g.dart';

@riverpod
class HeaderMenuController extends _$HeaderMenuController {
  @override
  bool build() => false;

  void toggleMenu() => state = !state;
}
