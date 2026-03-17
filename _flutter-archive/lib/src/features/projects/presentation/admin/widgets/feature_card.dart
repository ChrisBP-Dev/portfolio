import 'package:flutter/material.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';

class FeatureCard extends StatelessWidget {
  const FeatureCard({
    required this.title,
    super.key,
    this.removeTap,
    this.editTap,
  });

  final String title;
  final void Function()? removeTap;
  final void Function()? editTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(Sizes.p8),
      child: DecoratedBox(
        decoration: BoxDecoration(
          border: Border.all(
            color: context.theme.dividerColor,
          ),
        ),
        child: ListTile(
          title: Text(title),
          leading: IconButton(
            icon: const Icon(Icons.edit),
            onPressed: editTap,
          ),
          trailing: IconButton(
            icon: const Icon(Icons.delete),
            onPressed: removeTap,
          ),
        ),
      ),
    );
  }
}
