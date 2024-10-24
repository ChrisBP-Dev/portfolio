import 'package:flutter/material.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/features/settings/presentation/switch_locale_widget.dart';
import 'package:portfolio/src/features/settings/presentation/switch_theme_widget.dart';

class FullPageContainer extends StatelessWidget {
  const FullPageContainer({required this.page, super.key});
  final Widget page;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: page,
      floatingActionButton: const Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          SwitchThemeWidget(),
          gapH14,
          SwitchLocaleWidget(),
        ],
      ),
    );
  }
}
