import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/core/common_widgets/shader_text_effect.dart';
import 'package:portfolio/src/features/settings/presentation/theme_controller.dart';

class CustomTitleOnComponent extends ConsumerWidget {
  const CustomTitleOnComponent({
    required this.title,
    required this.gradientLight,
    required this.gradientDark,
    super.key,
  });
  final String title;
  final LinearGradient gradientDark;
  final LinearGradient gradientLight;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settingsProvider = ref.watch(themeControllerProvider);
    final headlineMedium = Theme.of(context).textTheme.headlineMedium;

    return AsyncValueWidget(
      value: settingsProvider,
      data: (themeMode) {
        return ShaderTextEffect(
          text: title,
          style: headlineMedium,
          gradient: themeMode == ThemeMode.dark ? gradientDark : gradientLight,
        );
      },
    );
  }
}
