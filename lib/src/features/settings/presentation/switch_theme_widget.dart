import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:portfolio/src/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/features/settings/presentation/theme_controller.dart';

class SwitchThemeWidget extends ConsumerWidget {
  const SwitchThemeWidget({
    super.key,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeProvider = ref.watch(themeControllerProvider);
    return AsyncValueWidget(
      value: themeProvider,
      data: (themeMode) {
        final icon = themeMode == ThemeMode.dark
            ? FontAwesomeIcons.sun
            : FontAwesomeIcons.moon;
        return FloatingActionButton(
          onPressed: ref.read(themeControllerProvider.notifier).changeTheme,
          child: Icon(icon),
        );
      },
    );
  }
}
