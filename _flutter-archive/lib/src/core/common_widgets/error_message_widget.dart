import 'package:flutter/material.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';

class ErrorMessageWidget extends StatelessWidget {
  const ErrorMessageWidget(this.errorMessage, {super.key});
  final String errorMessage;
  @override
  Widget build(BuildContext context) {
    return Text(
      errorMessage,
      style: context.headlineLarge?.copyWith(
        color: context.theme.colorScheme.error,
      ),
    );
  }
}
